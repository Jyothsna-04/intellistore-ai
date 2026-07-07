package com.intellistore.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.List;
import java.util.UUID;

/**
 * SSE Event Service — broadcasts real-time system events to connected browser clients.
 * Events are fired whenever AuditLogService records any action (upload, delete, login, etc.).
 * Connected frontend clients receive live event stream via EventSource API.
 */
@Service
public class SseEventService {

    private static final Logger log = LoggerFactory.getLogger(SseEventService.class);

    // Map of userId -> list of active SSE emitters (supports multiple tabs per user)
    private final Map<UUID, List<SseEmitter>> userEmitters = new ConcurrentHashMap<>();

    // Global emitters for admins watching all activity
    private final List<SseEmitter> globalEmitters = new CopyOnWriteArrayList<>();

    /**
     * Register a new SSE emitter for a specific user.
     */
    public SseEmitter createUserEmitter(UUID userId) {
        SseEmitter emitter = new SseEmitter(300_000L); // 5 minute timeout

        List<SseEmitter> emitters = userEmitters.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>());
        emitters.add(emitter);

        emitter.onCompletion(() -> {
            List<SseEmitter> list = userEmitters.get(userId);
            if (list != null) list.remove(emitter);
        });
        emitter.onTimeout(() -> {
            List<SseEmitter> list = userEmitters.get(userId);
            if (list != null) list.remove(emitter);
        });
        emitter.onError(e -> {
            List<SseEmitter> list = userEmitters.get(userId);
            if (list != null) list.remove(emitter);
        });

        // Send initial connection confirmation
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data(Map.of("message", "Activity stream connected", "timestamp", Instant.now().toString())));
        } catch (IOException e) {
            log.warn("Failed to send initial SSE event to user {}", userId);
        }

        log.info("SSE emitter registered for user {}", userId);
        return emitter;
    }

    /**
     * Register a global SSE emitter (for admin activity center watching all users).
     */
    public SseEmitter createGlobalEmitter() {
        SseEmitter emitter = new SseEmitter(300_000L);
        globalEmitters.add(emitter);

        emitter.onCompletion(() -> globalEmitters.remove(emitter));
        emitter.onTimeout(() -> globalEmitters.remove(emitter));
        emitter.onError(e -> globalEmitters.remove(emitter));

        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data(Map.of("message", "Global activity stream connected", "timestamp", Instant.now().toString())));
        } catch (IOException e) {
            log.warn("Failed to send initial global SSE event");
        }
        return emitter;
    }

    /**
     * Broadcast an activity event to all connected emitters (user-specific + global admins).
     * Called by AuditLogService after every log write.
     */
    public void broadcastEvent(ActivityEvent event) {
        Map<String, Object> payload = Map.of(
                "id",        event.eventId(),
                "category",  event.category(),
                "action",    event.action(),
                "message",   event.message(),
                "severity",  event.severity(),
                "userId",    event.userId() != null ? event.userId().toString() : "system",
                "email",     event.email() != null ? event.email() : "system",
                "resource",  event.resource() != null ? event.resource() : "",
                "status",    event.status(),
                "timestamp", event.timestamp().toString()
        );

        // Send to user-specific emitters
        if (event.userId() != null) {
            List<SseEmitter> emitters = userEmitters.getOrDefault(event.userId(), List.of());
            sendToEmitters(emitters, event.category(), payload);
        }

        // Send to all global admin watchers
        sendToEmitters(globalEmitters, event.category(), payload);
    }

    private void sendToEmitters(List<SseEmitter> emitters, String eventName, Map<String, Object> payload) {
        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(payload));
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        });
        emitters.removeAll(deadEmitters);
    }

    /**
     * Record type for SSE events.
     */
    public record ActivityEvent(
            String eventId,
            String category,
            String action,
            String message,
            String severity,   // INFO, WARNING, ERROR, SUCCESS
            UUID userId,
            String email,
            String resource,
            String status,
            Instant timestamp
    ) {
        public static ActivityEvent of(String category, String action, String message, String severity,
                                       UUID userId, String email, String resource, String status) {
            return new ActivityEvent(
                    UUID.randomUUID().toString(),
                    category, action, message, severity, userId, email, resource, status,
                    Instant.now()
            );
        }
    }
}

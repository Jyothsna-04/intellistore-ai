package com.intellistore.security;

import java.lang.annotation.*;

/**
 * Annotation to mark methods that should be audited.
 * The audit aspect will capture method execution details and store them in the SecurityLog entity.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {
    /**
     * The action name to be stored in the audit log.
     */
    String action();
}

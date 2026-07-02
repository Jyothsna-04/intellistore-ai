package com.intellistore.service;

import com.intellistore.exception.ClamAVUnavailableException;
import com.intellistore.exception.VirusDetectedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class ClamAVClient {

    @Value("${clamd.host:localhost}")
    private String host;

    @Value("${clamd.port:3310}")
    private int port;

    @Value("${clamd.timeoutMs:5000}")
    private int timeoutMs;

    private static final int CHUNK_SIZE = 2048;
    private static final byte[] INSTREAM = "nINSTREAM\n".getBytes();

    /**
     * Scans a file for viruses using clamd over TCP.
     * @param file The path to the temporary file to scan.
     * @throws VirusDetectedException if a virus is found.
     * @throws ClamAVUnavailableException if clamd cannot be reached.
     */
    public void scan(Path file) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), timeoutMs);
            socket.setSoTimeout(timeoutMs);

            try (OutputStream out = new BufferedOutputStream(socket.getOutputStream());
                 InputStream in = socket.getInputStream();
                 InputStream fileIn = Files.newInputStream(file)) {

                // Send INSTREAM command
                out.write(INSTREAM);
                out.flush();

                byte[] buffer = new byte[CHUNK_SIZE];
                int read;
                while ((read = fileIn.read(buffer)) >= 0) {
                    // Write chunk length (network byte order / big endian)
                    byte[] chunkSize = ByteBuffer.allocate(4).putInt(read).array();
                    out.write(chunkSize);
                    // Write chunk data
                    out.write(buffer, 0, read);
                }

                // Send 0-length chunk to signal end of stream
                out.write(new byte[]{0, 0, 0, 0});
                out.flush();

                // Read response
                byte[] responseBuffer = new byte[2048];
                int responseLength = in.read(responseBuffer);
                if (responseLength > 0) {
                    String response = new String(responseBuffer, 0, responseLength).trim();
                    if (!response.endsWith("OK")) {
                        throw new VirusDetectedException("Virus detected: " + response);
                    }
                } else {
                    throw new ClamAVUnavailableException("Empty response from clamd");
                }
            }
        } catch (IOException e) {
            throw new ClamAVUnavailableException("Could not connect to or communicate with clamd: " + e.getMessage(), e);
        }
    }
}

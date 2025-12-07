package WAWRO.PRE_KONSULTACJE.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class AiService {

    private final WebClient webClient;

    public AiService(@Value("${ai-service.url}") String baseUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }
    public String validateComment(String comment) {

        try {
            return webClient.post()
                    .uri("/validate/comment")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromValue(comment))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

        } catch (Exception e) {
            System.err.println("Error communicating with AI-service: " + e.getMessage());

            return "ERROR: Validation failed.";
        }
    }
}

package WAWRO.PRE_KONSULTACJE.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Pre-Consultation API",
                version = "1.0",
                description = "Dokumentacja API dla systemu pre-konsultacji.",
                contact = @Contact(
                        name = "WAWRO",
                        email = "kontakt@example.com"
                )
        )
)
public class OpenApiConfig {
}

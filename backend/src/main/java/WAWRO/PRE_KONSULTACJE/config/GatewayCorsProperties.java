package WAWRO.PRE_KONSULTACJE.config;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Getter
@ConfigurationProperties(prefix = "app.cors")
public class GatewayCorsProperties {

    private List<String> allowedOrigins;

    public void setAllowedOrigins(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }
}

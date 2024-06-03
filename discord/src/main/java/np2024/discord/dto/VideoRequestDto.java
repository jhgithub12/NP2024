package np2024.discord.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

public class VideoRequestDto {
    @Getter
    public static class JoinDto {
        @NotBlank
        private String username;
    }

}

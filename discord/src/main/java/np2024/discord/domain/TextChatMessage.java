package np2024.discord.domain;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class TextChatMessage {

    @NotBlank
    private String senderName;

    @NotBlank
    private String content;
}

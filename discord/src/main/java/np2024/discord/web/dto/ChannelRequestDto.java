package np2024.discord.web.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ChannelRequestDto {
    @NotNull
    private String name;
}

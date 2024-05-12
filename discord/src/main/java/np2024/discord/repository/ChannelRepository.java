package np2024.discord.repository;

import np2024.discord.domain.Channel;
import np2024.discord.dto.ChannelRequestDto;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class ChannelRepository {

    private static final AtomicLong sequence = new AtomicLong(0);
    private static final Map<Long, Channel> store = new ConcurrentHashMap<>();

    public Channel save(ChannelRequestDto request) {
        Channel channel = new Channel(sequence.incrementAndGet(), request.getName());
        store.put(channel.getId(), channel);
        return channel;
    }

    public List<Channel> findAll() {
        return new ArrayList<>(store.values());
    }

    public void update(Long channelId, ChannelRequestDto request) {
        Channel channel = store.get(channelId);
        channel.update(request.getName());
    }

    public void delete(Long channelId) {
        store.remove(channelId);
    }

    public boolean exists(Long channelId) {
        return store.containsKey(channelId);
    }
}

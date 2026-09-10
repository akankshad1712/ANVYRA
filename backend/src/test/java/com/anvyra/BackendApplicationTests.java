package com.anvyra;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(
    properties = {
        "spring.cache.type=none",
        "spring.autoconfigure.exclude=" +
            "org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration," +
            "org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration"
    }
)
@ActiveProfiles("test")
class BackendApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the Spring application context starts correctly
        // Uses H2 in-memory DB and disables Redis for tests
    }
}

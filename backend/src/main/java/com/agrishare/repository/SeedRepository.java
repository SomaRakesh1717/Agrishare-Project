package com.agrishare.repository;

import com.agrishare.model.Seed;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeedRepository extends MongoRepository<Seed, String> {
    List<Seed> findByCropTypeIgnoreCase(String cropType);
    List<Seed> findBySellerId(String sellerId);
    List<Seed> findByAvailableTrue();
}

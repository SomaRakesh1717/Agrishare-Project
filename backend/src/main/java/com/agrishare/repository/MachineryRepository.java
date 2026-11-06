package com.agrishare.repository;

import com.agrishare.model.Machinery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineryRepository extends MongoRepository<Machinery, String> {
    List<Machinery> findByCategoryIgnoreCase(String category);
    List<Machinery> findByOwnerId(String ownerId);
    List<Machinery> findByAvailableTrue();
}

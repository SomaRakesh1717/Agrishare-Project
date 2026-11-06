package com.agrishare.repository;

import com.agrishare.model.Labour;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabourRepository extends MongoRepository<Labour, String> {
    List<Labour> findBySkillsContainingIgnoreCase(String skill);
    List<Labour> findByAvailableTrue();
}

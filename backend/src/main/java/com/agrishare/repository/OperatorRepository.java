package com.agrishare.repository;

import com.agrishare.model.Operator;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OperatorRepository extends MongoRepository<Operator, String> {
    List<Operator> findByMachineryExpertiseContainingIgnoreCase(String expertise);
    List<Operator> findByAvailableTrue();
}

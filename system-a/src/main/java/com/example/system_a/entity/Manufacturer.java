package com.example.system_a.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "Manufacturer")
@Data
public class Manufacturer {
    @Id
    @Column(name = "Name")
    private String name;

    @Column(name = "Address", nullable = false)
    private String address;

    @OneToMany(mappedBy = "manufacturer")
    private List<Contract> contracts;

    @OneToMany(mappedBy = "manufacturer")
    private List<Makes> makes;
}
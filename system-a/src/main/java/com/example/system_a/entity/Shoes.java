package com.example.system_a.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "Shoes")
@IdClass(ShoesId.class)
@Data
public class Shoes {
    @Id
    @Column(name = "Model", nullable = false)
    private String model;

    @Id
    @Column(name = "Size", nullable = false)
    private Integer size;

    @OneToMany(mappedBy = "shoes")
    private List<Makes> makes;

    @OneToMany(mappedBy = "shoes")
    private List<Sells> sells;
}
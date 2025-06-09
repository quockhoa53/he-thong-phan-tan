package com.example.system_a.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "Salesperson")
@Data
public class Salesperson {
    @Id
    @Column(name = "SIN")
    private String sin;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Commission", nullable = false)
    private Double commission;

    @OneToMany(mappedBy = "salesperson")
    private List<Employs> employs;
}
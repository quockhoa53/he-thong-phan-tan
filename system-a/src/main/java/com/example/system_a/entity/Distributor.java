package com.example.system_a.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "Distributor")
@IdClass(DistributorId.class)
@Data
public class Distributor {
    @Id
    @Column(name = "Name", nullable = false)
    private String name;

    @Id
    @Column(name = "Address", nullable = false)
    private String address;

    @Column(name = "SIN", nullable = false)
    private String sin;

    @OneToMany(mappedBy = "distributor")
    private List<Contract> contracts;

    @OneToMany(mappedBy = "distributor")
    private List<Employs> employs;

    @OneToMany(mappedBy = "distributor")
    private List<Sells> sells;
}
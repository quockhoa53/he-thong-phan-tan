package com.example.system_a.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Employs")
@IdClass(EmploysId.class)
@Data
public class Employs {
    @Id
    @Column(name = "DistributorName", nullable = false)
    private String distributorName;

    @Id
    @Column(name = "DistributorAddress", nullable = false)
    private String distributorAddress;

    @Id
    @Column(name = "SalesSIN", nullable = false)
    private String salesSIN;

    @Column(name = "Base_Salary", nullable = false)
    private Double baseSalary;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "DistributorName", referencedColumnName = "Name", insertable = false, updatable = false),
            @JoinColumn(name = "DistributorAddress", referencedColumnName = "Address", insertable = false, updatable = false)
    })
    private Distributor distributor;

    @ManyToOne
    @JoinColumn(name = "SalesSIN", referencedColumnName = "SIN", insertable = false, updatable = false)
    private Salesperson salesperson;
}
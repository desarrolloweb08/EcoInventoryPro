package pe.edu.utp.ecoinventorypro.entity;

import jakarta.persistence.*;

@Entity
@Table(name="configuracion")
public class Configuracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreEmpresa;

    private String ruc;

    private String direccion;

    private String telefono;

    private Integer stockMinimoGlobal;

    public Configuracion(){}

    // Getter y Setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }

    public void setNombreEmpresa(String nombreEmpresa) {
        this.nombreEmpresa = nombreEmpresa;
    }

    public String getRuc() {
        return ruc;
    }

    public void setRuc(String ruc) {
        this.ruc = ruc;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Integer getStockMinimoGlobal() {
        return stockMinimoGlobal;
    }

    public void setStockMinimoGlobal(Integer stockMinimoGlobal) {
        this.stockMinimoGlobal = stockMinimoGlobal;
    }
    
}
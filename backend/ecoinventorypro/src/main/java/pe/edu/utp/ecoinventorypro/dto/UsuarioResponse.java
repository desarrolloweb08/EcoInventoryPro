package pe.edu.utp.ecoinventorypro.dto;

public class UsuarioResponse {

    private Long id;
    private String nombres;
    private String apellidos;
    private String correo;
    private String username;
    private String rol;
    private Boolean estado;  // <--- AGREGAR

    public UsuarioResponse() {
    }

    public UsuarioResponse(Long id, String nombres, String apellidos,
                           String correo, String username, String rol) {
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.correo = correo;
        this.username = username;
        this.rol = rol;
         this.estado = true;  // <--- VALOR POR DEFECTO
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
    public Boolean getEstado() { return estado; }  // <--- AGREGAR
    public void setEstado(Boolean estado) { this.estado = estado; }  // <--- AGREGAR

}
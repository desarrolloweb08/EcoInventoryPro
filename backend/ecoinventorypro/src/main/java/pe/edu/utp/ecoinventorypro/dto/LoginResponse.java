package pe.edu.utp.ecoinventorypro.dto;

public class LoginResponse {
    private Long id;
    private String username;
    private String nombres;
    private String apellidos;
    private String rol;
    private String token;  // <--- AGREGAR

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }
    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getToken() { return token; }  // <--- AGREGAR
    public void setToken(String token) { this.token = token; }  // <--- AGREGAR
}
package pe.edu.utp.ecoinventorypro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.utp.ecoinventorypro.dto.ApiResponse;
import pe.edu.utp.ecoinventorypro.dto.LoginRequest;
import pe.edu.utp.ecoinventorypro.dto.LoginResponse;
import pe.edu.utp.ecoinventorypro.entity.Usuario;
import pe.edu.utp.ecoinventorypro.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        try {
            // Buscar usuario por username
            Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Verificar contraseña
            // Verificar contraseña
System.out.println("===== LOGIN DEBUG =====");
System.out.println("Username recibido : [" + request.getUsername() + "]");
System.out.println("Password recibida : [" + request.getPassword() + "]");
System.out.println("Password BD       : [" + usuario.getPassword() + "]");

boolean coincide = passwordEncoder.matches(
        request.getPassword(),
        usuario.getPassword()
);

System.out.println("Resultado matches : " + coincide);

if (!coincide) {
    return ResponseEntity.status(401)
            .body(new ApiResponse<>(false, "Contraseña incorrecta", null));
}

            // Verificar estado del usuario
            if (!usuario.getEstado()) {
                return ResponseEntity.status(403).body(new ApiResponse<>(false, "Usuario inactivo", null));
            }

            // Crear respuesta con token
            LoginResponse response = new LoginResponse();
            response.setId(usuario.getId());
            response.setUsername(usuario.getUsername());
            response.setNombres(usuario.getNombres());
            response.setApellidos(usuario.getApellidos());
            response.setRol(usuario.getRol().getNombre());
            response.setToken("token-temp-" + System.currentTimeMillis());  // <--- TOKEN TEMPORAL

            return ResponseEntity.ok(new ApiResponse<>(true, "Login exitoso", response));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Error interno: " + e.getMessage(), null));
        }
    }
}
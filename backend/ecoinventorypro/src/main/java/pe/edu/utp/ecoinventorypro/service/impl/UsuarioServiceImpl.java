package pe.edu.utp.ecoinventorypro.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecoinventorypro.dto.UsuarioRequest;
import pe.edu.utp.ecoinventorypro.dto.UsuarioResponse;
import pe.edu.utp.ecoinventorypro.entity.Rol;
import pe.edu.utp.ecoinventorypro.entity.Usuario;
import pe.edu.utp.ecoinventorypro.exception.ResourceNotFoundException;
import pe.edu.utp.ecoinventorypro.repository.RolRepository;
import pe.edu.utp.ecoinventorypro.repository.UsuarioRepository;
import pe.edu.utp.ecoinventorypro.service.UsuarioService;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
public List<UsuarioResponse> listar() {
    return usuarioRepository.findAll()
            .stream()
            .map(usuario -> {
                UsuarioResponse response = new UsuarioResponse(
                        usuario.getId(),
                        usuario.getNombres(),
                        usuario.getApellidos(),
                        usuario.getCorreo(),
                        usuario.getUsername(),
                        usuario.getRol().getNombre()
                );
                response.setEstado(usuario.getEstado());  // <--- AGREGAR
                return response;
            })
            .collect(Collectors.toList());
}

    @Override
public UsuarioResponse obtener(Long id) {
    Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

    UsuarioResponse response = new UsuarioResponse(
            usuario.getId(),
            usuario.getNombres(),
            usuario.getApellidos(),
            usuario.getCorreo(),
            usuario.getUsername(),
            usuario.getRol().getNombre()
    );
    response.setEstado(usuario.getEstado());  // <--- AGREGAR
    return response;
}

    @Override
    public UsuarioResponse guardar(UsuarioRequest request) {
        // Validar duplicados
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El username ya existe: " + request.getUsername());
        }
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("El correo ya existe: " + request.getCorreo());
        }

        // Obtener el rol
        Rol rol = rolRepository.findById(request.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));

        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setNombres(request.getNombres());
        usuario.setApellidos(request.getApellidos());
        usuario.setCorreo(request.getCorreo());
        usuario.setUsername(request.getUsername());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);
        usuario.setEstado(true);

        Usuario guardado = usuarioRepository.save(usuario);

        return new UsuarioResponse(
                guardado.getId(),
                guardado.getNombres(),
                guardado.getApellidos(),
                guardado.getCorreo(),
                guardado.getUsername(),
                guardado.getRol().getNombre());
    }

    @Override
    public UsuarioResponse actualizar(Long id, UsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Validar duplicados (excepto el mismo)
        if (!usuario.getUsername().equals(request.getUsername())
                && usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El username ya existe: " + request.getUsername());
        }
        if (!usuario.getCorreo().equals(request.getCorreo())
                && usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("El correo ya existe: " + request.getCorreo());
        }

        Rol rol = rolRepository.findById(request.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));

        usuario.setNombres(request.getNombres());
        usuario.setApellidos(request.getApellidos());
        usuario.setCorreo(request.getCorreo());
        usuario.setUsername(request.getUsername());
        usuario.setRol(rol);

        // Solo actualizar contraseña si se envía una nueva
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        Usuario actualizado = usuarioRepository.save(usuario);

        return new UsuarioResponse(
                actualizado.getId(),
                actualizado.getNombres(),
                actualizado.getApellidos(),
                actualizado.getCorreo(),
                actualizado.getUsername(),
                actualizado.getRol().getNombre());
    }

    @Override
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        usuarioRepository.delete(usuario);
    }
}
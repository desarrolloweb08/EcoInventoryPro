package pe.edu.utp.ecoinventorypro.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecoinventorypro.repository.RolRepository;
import pe.edu.utp.ecoinventorypro.service.RolService;
import java.util.stream.Collectors;
import pe.edu.utp.ecoinventorypro.dto.RolResponse;
import pe.edu.utp.ecoinventorypro.dto.RolRequest;
import pe.edu.utp.ecoinventorypro.entity.Rol;
import pe.edu.utp.ecoinventorypro.exception.ResourceNotFoundException;

@Service
public class RolServiceImpl implements RolService {

    @Autowired
    private RolRepository rolRepository;

    @Override
public List<RolResponse> listarTodos() {

    return rolRepository.findAll()
            .stream()
            .map(rol -> new RolResponse(
                    rol.getId(),
                    rol.getNombre(),
                    rol.getDescripcion()))
            .collect(Collectors.toList());

}

    @Override
public RolResponse obtenerPorId(Long id) {

    Rol rol = rolRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Rol no encontrado"));

    return new RolResponse(
            rol.getId(),
            rol.getNombre(),
            rol.getDescripcion());

}

    @Override
public RolResponse guardar(RolRequest request) {

    if (rolRepository.existsByNombre(request.getNombre())) {
        throw new RuntimeException("Ya existe un rol con ese nombre");
    }

    Rol rol = new Rol();

    rol.setNombre(request.getNombre());
    rol.setDescripcion(request.getDescripcion());

    Rol guardado = rolRepository.save(rol);

    return new RolResponse(
            guardado.getId(),
            guardado.getNombre(),
            guardado.getDescripcion());

}

    @Override
public RolResponse actualizar(Long id, RolRequest request) {

    Rol rol = rolRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Rol no encontrado"));

    rol.setNombre(request.getNombre());
    rol.setDescripcion(request.getDescripcion());

    Rol actualizado = rolRepository.save(rol);

    return new RolResponse(
            actualizado.getId(),
            actualizado.getNombre(),
            actualizado.getDescripcion());

}

    @Override
public void eliminar(Long id) {

    Rol rol = rolRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Rol no encontrado"));

    rolRepository.delete(rol);

}

}
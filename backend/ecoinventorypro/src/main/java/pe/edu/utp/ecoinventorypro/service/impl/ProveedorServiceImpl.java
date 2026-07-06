package pe.edu.utp.ecoinventorypro.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecoinventorypro.dto.ProveedorRequest;
import pe.edu.utp.ecoinventorypro.dto.ProveedorResponse;
import pe.edu.utp.ecoinventorypro.entity.Proveedor;
import pe.edu.utp.ecoinventorypro.exception.ResourceNotFoundException;
import pe.edu.utp.ecoinventorypro.repository.ProveedorRepository;
import pe.edu.utp.ecoinventorypro.service.ProveedorService;

@Service
public class ProveedorServiceImpl implements ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Override
    public List<ProveedorResponse> listar() {
        return proveedorRepository.findAll()
                .stream()
                .map(p -> new ProveedorResponse(
                        p.getId(),
                        p.getNombre(),
                        p.getRuc(),
                        p.getDireccion(),
                        p.getTelefono(),
                        p.getCorreo(),
                        p.getDescripcion()))
                .collect(Collectors.toList());
    }

    @Override
    public ProveedorResponse obtener(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));

        return new ProveedorResponse(
                proveedor.getId(),
                proveedor.getNombre(),
                proveedor.getRuc(),
                proveedor.getDireccion(),
                proveedor.getTelefono(),
                proveedor.getCorreo(),
                proveedor.getDescripcion());
    }

    @Override
    public ProveedorResponse guardar(ProveedorRequest request) {
        if (request.getRuc() != null && proveedorRepository.existsByRuc(request.getRuc())) {
            throw new RuntimeException("Ya existe un proveedor con ese RUC");
        }
        if (request.getCorreo() != null && proveedorRepository.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("Ya existe un proveedor con ese email");
        }

        Proveedor proveedor = new Proveedor();
        proveedor.setNombre(request.getNombre());
        proveedor.setRuc(request.getRuc());
        proveedor.setDireccion(request.getDireccion());
        proveedor.setTelefono(request.getTelefono());
        proveedor.setCorreo(request.getCorreo());
        proveedor.setDescripcion(request.getDescripcion());
        proveedor.setEstado(true);  // <--- AGREGAR ESTA LÍNEA

        Proveedor guardado = proveedorRepository.save(proveedor);

        return new ProveedorResponse(
                guardado.getId(),
                guardado.getNombre(),
                guardado.getRuc(),
                guardado.getDireccion(),
                guardado.getTelefono(),
                guardado.getCorreo(),
                guardado.getDescripcion());
    }

    @Override
    public ProveedorResponse actualizar(Long id, ProveedorRequest request) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));

        if (request.getRuc() != null &&
                !request.getRuc().equals(proveedor.getRuc()) &&
                proveedorRepository.existsByRuc(request.getRuc())) {
            throw new RuntimeException("Ya existe un proveedor con ese RUC");
        }
        if (request.getCorreo() != null &&
                !request.getCorreo().equals(proveedor.getCorreo()) &&
                proveedorRepository.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("Ya existe un proveedor con ese email");
        }

        proveedor.setNombre(request.getNombre());
        proveedor.setRuc(request.getRuc());
        proveedor.setDireccion(request.getDireccion());
        proveedor.setTelefono(request.getTelefono());
        proveedor.setCorreo(request.getCorreo());
        proveedor.setDescripcion(request.getDescripcion());

        Proveedor actualizado = proveedorRepository.save(proveedor);

        return new ProveedorResponse(
                actualizado.getId(),
                actualizado.getNombre(),
                actualizado.getRuc(),
                actualizado.getDireccion(),
                actualizado.getTelefono(),
                actualizado.getCorreo(),
                actualizado.getDescripcion());
    }

    @Override
    public void eliminar(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));
        proveedorRepository.delete(proveedor);
    }
}
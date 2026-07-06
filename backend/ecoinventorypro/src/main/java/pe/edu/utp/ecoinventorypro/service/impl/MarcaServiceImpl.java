package pe.edu.utp.ecoinventorypro.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecoinventorypro.dto.MarcaRequest;
import pe.edu.utp.ecoinventorypro.dto.MarcaResponse;
import pe.edu.utp.ecoinventorypro.entity.Marca;
import pe.edu.utp.ecoinventorypro.exception.ResourceNotFoundException;
import pe.edu.utp.ecoinventorypro.repository.MarcaRepository;
import pe.edu.utp.ecoinventorypro.service.MarcaService;

@Service
public class MarcaServiceImpl implements MarcaService {

    @Autowired
    private MarcaRepository marcaRepository;

    @Override
    public List<MarcaResponse> listar() {
        return marcaRepository.findAll()
                .stream()
                .map(m -> new MarcaResponse(
                        m.getId(),
                        m.getNombre(),
                        m.getDescripcion()))
                .collect(Collectors.toList());
    }

    @Override
    public MarcaResponse obtener(Long id) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada"));

        return new MarcaResponse(
                marca.getId(),
                marca.getNombre(),
                marca.getDescripcion());
    }

    @Override
public MarcaResponse guardar(MarcaRequest request) {
    if (marcaRepository.existsByNombre(request.getNombre())) {
        throw new RuntimeException("Ya existe una marca con ese nombre");
    }

    Marca marca = new Marca();
    marca.setNombre(request.getNombre());
    marca.setDescripcion(request.getDescripcion());
    marca.setEstado(true);  // <--- AGREGAR ESTA LÍNEA

    Marca guardado = marcaRepository.save(marca);

    return new MarcaResponse(
            guardado.getId(),
            guardado.getNombre(),
            guardado.getDescripcion());
}

    @Override
    public MarcaResponse actualizar(Long id, MarcaRequest request) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada"));

        if (!marca.getNombre().equals(request.getNombre())
                && marcaRepository.existsByNombre(request.getNombre())) {
            throw new RuntimeException("Ya existe una marca con ese nombre");
        }

        marca.setNombre(request.getNombre());
        marca.setDescripcion(request.getDescripcion());

        Marca actualizado = marcaRepository.save(marca);

        return new MarcaResponse(
                actualizado.getId(),
                actualizado.getNombre(),
                actualizado.getDescripcion());
    }

    @Override
    public void eliminar(Long id) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada"));
        marcaRepository.delete(marca);
    }
}
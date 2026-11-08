package ru.itmo.web.student;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class StudentServiceTest {
    private StudentRepository repository;
    private StudentService service;
    @BeforeEach
    void setUp() {
        repository = mock(StudentRepository.class);
        service = new StudentService(repository);
    }
    private StudentRequestDto request(Integer isuId) {
        return new StudentRequestDto("Иван Иванов", "P3210", isuId, 8, 315, LocalDate.of(2026, 9, 1), false, "Заметка"
        );
    }
    @Test
    void missingStudentReturnsNotFound() {
        assertThrows(StudentNotFoundException.class, () -> service.getById(42L));
    }
    @Test
    void duplicateIsuIsRejectedBeforeSaving() {
        Student existing = new Student();
        existing.setId(1L);
        when(repository.findByIsuId(123456)).thenReturn(Optional.of(existing));
        assertThrows(DuplicateStudentException.class, () -> service.create(request(123456)));
        verify(repository, never()).saveAndFlush(any());
    }
    @Test
    void putCannotChangeIsuId() {
        Student existing = new Student();
        existing.setIsuId(123456);
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        assertThrows(IllegalArgumentException.class, () -> service.update(1L, request(654321)));
        assertEquals(123456, existing.getIsuId());
        verify(repository, never()).save(any());
    }
    @Test
    void putWithSameIsuUpdatesOtherFields() {
        Student existing = new Student();
        existing.setId(1L);
        existing.setIsuId(123456);
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.findByIsuId(123456)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);
        StudentResponseDto result = service.update(1L, request(123456));
        assertEquals(1L, result.id());
        assertEquals(123456, result.isuId());
        assertEquals("Иван Иванов", result.fullName());
        assertEquals("P3210", result.groupName());
    }
    @Test
    void patchPreservesOmittedFields() {
        Student existing = new Student();
        existing.setIsuId(123456);
        existing.setFullName("Иван Иванов");
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);
        StudentResponseDto result = service.patch(1L, new StudentPatchRequestDto(
                null, null, null, null, null, null, null, "Новая заметка"));
        assertEquals("Иван Иванов", result.fullName());
        assertEquals(123456, result.isuId());
        assertEquals("Новая заметка", result.notes());
    }
    @Test
    void invalidPaginationIsRejected() {
        assertThrows(IllegalArgumentException.class, () -> service.search(
                null, null, null, null, null, null, null, -1, 20, "id", "asc"));
        assertThrows(IllegalArgumentException.class, () -> service.search(
                null, null, null, null, null, null, null, 0, 101, "id", "asc"));
        assertThrows(IllegalArgumentException.class, () -> service.search(
                null, null, null, null, null, null, null, 0, 20, "unknown", "asc"));
    }

    @Test
    void invalidNumericFiltersAreRejected() {
        for (String value : new String[]{"abc", "0", "-1", "1.5", "2147483648"}) {
            assertThrows(IllegalArgumentException.class, () -> service.search(
                    null, null, value, null, null, null, null, 0, 10, "id", "asc"));
            assertThrows(IllegalArgumentException.class, () -> service.search(
                    null, null, null, null, value, null, null, 0, 10, "id", "asc"));
        }
        verifyNoInteractions(repository);
    }

    @Test
    void notesAndForeignerCanBeSortedWithStablePagination() {
        when(repository.findAll(any(org.springframework.data.jpa.domain.Specification.class),
                any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(org.springframework.data.domain.Page.empty());
        service.search(" Иван ", null, "123456", 8, "315", null,
                false, 1, 20, "notes", "desc", "заметка");
        var pageable = org.mockito.ArgumentCaptor.forClass(org.springframework.data.domain.Pageable.class);
        verify(repository).findAll(any(org.springframework.data.jpa.domain.Specification.class), pageable.capture());
        assertEquals(1, pageable.getValue().getPageNumber());
        assertEquals(20, pageable.getValue().getPageSize());
        assertEquals(org.springframework.data.domain.Sort.Direction.DESC,
                pageable.getValue().getSort().getOrderFor("notes").getDirection());
        assertNotNull(pageable.getValue().getSort().getOrderFor("id"));
    }

    @Test
    void patchRoomUsesNumericValidation() {
        try (var factory = jakarta.validation.Validation.buildDefaultValidatorFactory()) {
            var validator = factory.getValidator();
            assertTrue(validator.validate(new StudentPatchRequestDto(
                    null, null, null, null, 315, null, null, null)).isEmpty());
            assertFalse(validator.validate(new StudentPatchRequestDto(
                    null, null, null, null, 0, null, null, null)).isEmpty());
        }
    }
}

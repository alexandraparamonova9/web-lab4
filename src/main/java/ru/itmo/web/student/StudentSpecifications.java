package ru.itmo.web.student;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;
public class StudentSpecifications {
    public static Specification<Student> withFilters(
            String fullName,
            String groupName,
            Integer isuId,
            Integer dormNumber,
            Integer room,
            LocalDate moveInDate,
            Boolean isForeigner,
            String notes
    ) {
        return (root, query, cb) -> {
            var predicates = new java.util.ArrayList<
                    jakarta.persistence.criteria.Predicate>();
            if (fullName != null && !fullName.isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("fullName")),
                                contains(fullName), '\\'
                        )
                );
            }
            if (groupName != null && !groupName.isBlank()) {
                predicates.add(
                        cb.equal(root.get("groupName"), groupName)
                );
            }
            if (isuId != null) {
                predicates.add(
                        cb.equal(root.get("isuId"), isuId)
                );
            }
            if (dormNumber != null) {
                predicates.add(
                        cb.equal(root.get("dormNumber"), dormNumber)
                );
            }
            if (room != null) {
                predicates.add(
                        cb.equal(root.get("room"), room)
                );
            }
            if (moveInDate != null) {
                predicates.add(
                        cb.equal(root.get("moveInDate"), moveInDate)
                );
            }
            if (isForeigner != null) {
                predicates.add(
                        cb.equal(root.get("isForeigner"), isForeigner)
                );
            }
            if (notes != null && !notes.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("notes")), contains(notes), '\\'));
            }
            return cb.and(predicates.toArray(
                    new jakarta.persistence.criteria.Predicate[0]
            ));
        };
    }

    private static String contains(String value) {
        return "%" + value.toLowerCase(java.util.Locale.ROOT)
                .replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%";
    }
}

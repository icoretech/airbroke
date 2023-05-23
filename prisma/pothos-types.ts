/* eslint-disable */
import type { Prisma, project, notice, occurrence, hourly_occurrence } from "@prisma/client";
export default interface PrismaTypes {
    project: {
        Name: "project";
        Shape: project;
        Include: Prisma.projectInclude;
        Select: Prisma.projectSelect;
        OrderBy: Prisma.projectOrderByWithRelationInput;
        WhereUnique: Prisma.projectWhereUniqueInput;
        Where: Prisma.projectWhereInput;
        Create: {};
        Update: {};
        RelationName: "notices";
        ListRelations: "notices";
        Relations: {
            notices: {
                Shape: notice[];
                Name: "notice";
            };
        };
    };
    notice: {
        Name: "notice";
        Shape: notice;
        Include: Prisma.noticeInclude;
        Select: Prisma.noticeSelect;
        OrderBy: Prisma.noticeOrderByWithRelationInput;
        WhereUnique: Prisma.noticeWhereUniqueInput;
        Where: Prisma.noticeWhereInput;
        Create: {};
        Update: {};
        RelationName: "project" | "occurrences";
        ListRelations: "occurrences";
        Relations: {
            project: {
                Shape: project;
                Name: "project";
            };
            occurrences: {
                Shape: occurrence[];
                Name: "occurrence";
            };
        };
    };
    occurrence: {
        Name: "occurrence";
        Shape: occurrence;
        Include: Prisma.occurrenceInclude;
        Select: Prisma.occurrenceSelect;
        OrderBy: Prisma.occurrenceOrderByWithRelationInput;
        WhereUnique: Prisma.occurrenceWhereUniqueInput;
        Where: Prisma.occurrenceWhereInput;
        Create: {};
        Update: {};
        RelationName: "notice" | "hourly_occurrences";
        ListRelations: "hourly_occurrences";
        Relations: {
            notice: {
                Shape: notice;
                Name: "notice";
            };
            hourly_occurrences: {
                Shape: hourly_occurrence[];
                Name: "hourly_occurrence";
            };
        };
    };
    hourly_occurrence: {
        Name: "hourly_occurrence";
        Shape: hourly_occurrence;
        Include: Prisma.hourly_occurrenceInclude;
        Select: Prisma.hourly_occurrenceSelect;
        OrderBy: Prisma.hourly_occurrenceOrderByWithRelationInput;
        WhereUnique: Prisma.hourly_occurrenceWhereUniqueInput;
        Where: Prisma.hourly_occurrenceWhereInput;
        Create: {};
        Update: {};
        RelationName: "occurrence";
        ListRelations: never;
        Relations: {
            occurrence: {
                Shape: occurrence;
                Name: "occurrence";
            };
        };
    };
}
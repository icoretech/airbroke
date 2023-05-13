'use client';

import { project } from '@prisma/client';
import { Badge, Card, Flex, Text, Title } from '@tremor/react';
import Link from 'next/link';

export default function ProjectCard({ project }: { project: project }) {
  return (
    <Card className="mt-6" decoration="left" decorationColor="slate">
      <Flex justifyContent="start" className="space-x-2">
        <Title>
          <Link href={`/projects/${project.id}/notices`}>{project.name} Project</Link>
        </Title>
        <Badge color="gray">{project.notices_count.toString()}</Badge>
      </Flex>
      <Text className="mt-2">
        <Link href="/">go back to projects</Link>
      </Text>
    </Card>
  );
}

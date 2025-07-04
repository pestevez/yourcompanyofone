import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@yourcompanyofone/database';
import { CreateOrganizationDto, UpdateOrganizationDto, AddMemberDto } from './dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        plan: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            content: true,
            platformIdentities: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const organization = await this.prisma.organization.findFirst({
      where: {
        id,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        plan: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            content: true,
            platformIdentities: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async create(createOrganizationDto: CreateOrganizationDto, userId: string) {
    // Get the free plan
    const freePlan = await this.prisma.organizationPlan.findUnique({
      where: { name: 'Free' },
    });

    if (!freePlan) {
      throw new Error('Free plan not found in database');
    }

    return this.prisma.organization.create({
      data: {
        name: createOrganizationDto.name,
        planId: freePlan.id,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        plan: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto, userId: string) {
    // Check if user is admin of the organization
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId: id,
        userId,
        role: 'ADMIN',
      },
    });

    if (!membership) {
      throw new ForbiddenException('Only organization admins can update organization details');
    }

    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
      include: {
        plan: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    // Check if user is admin of the organization
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId: id,
        userId,
        role: 'ADMIN',
      },
    });

    if (!membership) {
      throw new ForbiddenException('Only organization admins can delete organizations');
    }

    // Check if this is the only admin
    const adminCount = await this.prisma.organizationMember.count({
      where: {
        organizationId: id,
        role: 'ADMIN',
      },
    });

    if (adminCount === 1) {
      throw new ForbiddenException('Cannot delete organization with only one admin');
    }

    await this.prisma.organization.delete({
      where: { id },
    });

    return { message: 'Organization deleted successfully' };
  }

  async getMembers(organizationId: string, userId: string) {
    // Check if user is a member of the organization
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.organizationMember.findMany({
      where: {
        organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async addMember(organizationId: string, addMemberDto: AddMemberDto, userId: string) {
    // Check if user is admin of the organization
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
        role: 'ADMIN',
      },
    });

    if (!membership) {
      throw new ForbiddenException('Only organization admins can add members');
    }

    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: addMemberDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a member
    const existingMembership = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: user.id,
      },
    });

    if (existingMembership) {
      throw new ConflictException('User is already a member of this organization');
    }

    return this.prisma.organizationMember.create({
      data: {
        organizationId,
        userId: user.id,
        role: addMemberDto.role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async removeMember(organizationId: string, memberId: string, userId: string) {
    // Check if user is admin of the organization
    const adminMembership = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
        role: 'ADMIN',
      },
    });

    if (!adminMembership) {
      throw new ForbiddenException('Only organization admins can remove members');
    }

    // Check if trying to remove the last admin
    const targetMembership = await this.prisma.organizationMember.findFirst({
      where: {
        id: memberId,
        organizationId,
      },
    });

    if (!targetMembership) {
      throw new NotFoundException('Member not found');
    }

    if (targetMembership.role === 'ADMIN') {
      const adminCount = await this.prisma.organizationMember.count({
        where: {
          organizationId,
          role: 'ADMIN',
        },
      });

      if (adminCount === 1) {
        throw new ForbiddenException('Cannot remove the last admin from the organization');
      }
    }

    await this.prisma.organizationMember.delete({
      where: { id: memberId },
    });

    return { message: 'Member removed successfully' };
  }
} 
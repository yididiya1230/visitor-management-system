using AutoMapper;
using ECX.VisitorManagement.Application.DTOs.Dashboard;
using ECX.VisitorManagement.Application.DTOs.Department;
using ECX.VisitorManagement.Application.DTOs.Host;
using ECX.VisitorManagement.Application.DTOs.Visit;
using ECX.VisitorManagement.Application.DTOs.Visitor;
using ECX.VisitorManagement.Domain.Entities;

namespace ECX.VisitorManagement.Application.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Visitor, VisitorDto>();
        CreateMap<CreateVisitorRequest, Visitor>();
        CreateMap<UpdateVisitorRequest, Visitor>();

        CreateMap<Department, DepartmentDto>();
        CreateMap<CreateDepartmentRequest, Department>();
        CreateMap<UpdateDepartmentRequest, Department>();

        CreateMap<Domain.Entities.Host, HostDto>()
            .ForMember(d => d.FullName, o => o.MapFrom(s => s.User.FullName))
            .ForMember(d => d.Email, o => o.MapFrom(s => s.User.Email))
            .ForMember(d => d.PhoneNumber, o => o.MapFrom(s => s.User.PhoneNumber))
            .ForMember(d => d.DepartmentName, o => o.MapFrom(s => s.Department.Name));

        CreateMap<Visit, VisitDto>()
            .ForMember(d => d.VisitorName, o => o.MapFrom(s => $"{s.Visitor.FirstName} {s.Visitor.LastName}"))
            .ForMember(d => d.HostName, o => o.MapFrom(s => s.Host.User.FullName))
            .ForMember(d => d.DepartmentName, o => o.MapFrom(s => s.Host.Department.Name))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));

        CreateMap<Visit, RecentVisitDto>()
            .ForMember(d => d.VisitorName, o => o.MapFrom(s => $"{s.Visitor.FirstName} {s.Visitor.LastName}"))
            .ForMember(d => d.HostName, o => o.MapFrom(s => s.Host.User.FullName))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));
    }
}

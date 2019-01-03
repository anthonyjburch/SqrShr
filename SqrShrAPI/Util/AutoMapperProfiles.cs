using AutoMapper;
using SqrShrAPI.Models;
using SqrShrAPI.Dtos.User;
using SqrShrAPI.Dtos.Media;
using System.Linq;
using SqrShrAPI.Dtos.Post;

namespace SqrShrAPI.Util
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserDetailDto>()
                .ForMember(dest => dest.ProfileImageUrl, opt => {
                    opt.MapFrom(src => src.ProfileImages.FirstOrDefault(i => i.Current).Url);
                });
                
            CreateMap<User, UserListDto>()
                .ForMember(dest =>  dest.ProfileImageUrl, opt => {
                    opt.MapFrom(src => src.ProfileImages.FirstOrDefault(i => i.Current).Url);
                });

            CreateMap<User, UserLoginReturnDto>()
                .ForMember(dest => dest.ProfileImageUrl, opt => {
                    opt.MapFrom(src => src.ProfileImages.FirstOrDefault(i => i.Current).Url);
                });

            CreateMap<User, PostUserReturnDto>()
                .ForMember(dest => dest.ProfileImageUrl, opt => {
                    opt.MapFrom(src => src.ProfileImages.FirstOrDefault(i => i.Current).Url);
                });

            CreateMap<Post, PostReturnDto>()
                .ForMember(dest => dest.Score, opt => {
                    opt.MapFrom(src => src.Votes.Where(v => v.Upvote == true).Count() - src.Votes.Where(v => v.Upvote == false).Count());
                })
                .ForMember(dest => dest.PostImages, opt => {
                    opt.MapFrom(src => src.PostImages.Select(i => i.Url));
                });

            CreateMap<Comment, CommentReturnDto>()
                .ForMember(dest => dest.Score, opt => {
                    opt.MapFrom(src => src.Votes.Where(v => v.Upvote == true).Count() - src.Votes.Where(v => v.Upvote == false).Count());
                });
                
            CreateMap<UserUpdateDto, User>();
            CreateMap<ProfileImage, ProfileImageReturnDto>();
        }
    }
}
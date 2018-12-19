using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SqrShrAPI.Data.Interfaces;
using SqrShrAPI.Dtos.Post;
using SqrShrAPI.Dtos.User;
using SqrShrAPI.Models;
using SqrShrAPI.Util;

namespace SqrShrAPI.Controllers
{
    [ServiceFilter(typeof(UpdateUserLastActivityDate))]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ISqrShrRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(ISqrShrRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetUser(string username)
        {
            var user = await _repo.GetUser(username);

            var userDetailDto = _mapper.Map<UserDetailDto>(user);

            if (User.FindFirst(ClaimTypes.NameIdentifier) != null)
            {
                userDetailDto.IsFollowing = await _repo.GetFollow(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value), user.Id) != null;
            }

            return Ok(userDetailDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]PaginationParams paginationParams)
        {
            var users = await _repo.GetUsers(paginationParams);

            var userListDto = _mapper.Map<IEnumerable<UserListDto>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(userListDto);
        }        

        [HttpPut("{username}")]
        public async Task<IActionResult> UpdateUser(string username, UserUpdateDto userUpdateDto)
        {
            var user = await _repo.GetUser(username);
            
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();

            _mapper.Map(userUpdateDto, user);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Failed to update user: {user.Id} - {user.Username}");
        }

        [HttpGet("{username}/follows/{targetUsername}")]
        public async Task<IActionResult> FollowsUser(string username, string targetUsername)
        {
            if (username == targetUsername)
                return BadRequest("Cannot follow self");

            var sourceUser = await _repo.GetUser(username);
            var targetUser = await _repo.GetUser(targetUsername);

            if (sourceUser == null || targetUser == null)
                return NotFound();

            var follow = await _repo.GetFollow(sourceUser.Id, targetUser.Id);

            return Ok(follow != null);
        }

        [Authorize]
        [HttpPost("{username}/follow/{targetUsername}")]
        public async Task<IActionResult> FollowUser(string username, string targetUsername)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();

            if (username == targetUsername)
                return BadRequest("Cannot follow self");

            var sourceUser = await _repo.GetUser(username);
            var targetUser = await _repo.GetUser(targetUsername);

            if (sourceUser == null || targetUser == null)
                return NotFound();

            var follow = await _repo.GetFollow(sourceUser.Id, targetUser.Id);

            if (follow != null)
                return BadRequest("User already followed");

            if (targetUser.IsPrivate)
            {
                //TODO: Handle private user follow request.
                return BadRequest("This user's profile is set to private");
            }

            follow = new Follow
            {
                SourceId = sourceUser.Id,
                TargetId = targetUser.Id
            };

            _repo.Add<Follow>(follow);

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to follow user");
        }

        [Authorize]
        [HttpPost("{username}/unfollow/{targetUsername}")]
        public async Task<IActionResult> UnfollowUser(string username, string targetUsername)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();

            if (username == targetUsername)
                return BadRequest("Cannot follow self");

            var sourceUser = await _repo.GetUser(username);
            var targetUser = await _repo.GetUser(targetUsername);

            if (sourceUser == null || targetUser == null)
                return NotFound();

            var follow = await _repo.GetFollow(sourceUser.Id, targetUser.Id);

            if (follow == null)
                return NotFound();

            _repo.Delete(follow);

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to unfollow user");
        }

        [HttpGet("{username}/followers")]
        public async Task<IActionResult> GetUserFollowers(string username, [FromQuery]PaginationParams paginationParams)
        {
            var user = await _repo.GetUser(username);

            if (user == null)
                return NotFound();

            if (!await followsPrivateUser(user))
                return Ok();
            
            var followers = await _repo.GetFollowers(user.Id, paginationParams);
            var followerListDto = _mapper.Map<IEnumerable<UserListDto>>(followers);

            if (int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out int currentUserId))
            {
                foreach (var u in followerListDto)
                {
                    u.IsFollowing = currentUserId != u.Id && await _repo.GetFollow(currentUserId, u.Id) != null;
                }
            }

            Response.AddPagination(followers.CurrentPage, followers.PageSize, followers.TotalCount, followers.TotalPages);

            return Ok(followerListDto);
        }

        [HttpGet("{username}/following")]
        public async Task<IActionResult> GetUserFollowing(string username, [FromQuery]PaginationParams paginationParams)
        {
            var user = await _repo.GetUser(username);

            if (user == null)
                return NotFound();

            if (!await followsPrivateUser(user))
                return Ok();

            var following = await _repo.GetFollowing(user.Id, paginationParams);
            var followingListDto = _mapper.Map<IEnumerable<UserListDto>>(following);

            if (int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out int currentUserId))
            {
                foreach (var u in followingListDto)
                {
                    u.IsFollowing = currentUserId != u.Id && await _repo.GetFollow(currentUserId, u.Id) != null;
                }
            }

            Response.AddPagination(following.CurrentPage, following.PageSize, following.TotalCount, following.TotalPages);

            return Ok(followingListDto);
        }

        [Authorize]
        [HttpGet("{username}/stream")]
        public async Task<IActionResult> GetUserStream(string username, [FromQuery]PaginationParams paginationParams)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();

            var user = await _repo.GetUser(username);

            if (user == null)
                return NotFound();

            var stream = await _repo.GetStream(user.Id, paginationParams);
            var streamDto = _mapper.Map<IEnumerable<PostReturnDto>>(stream);

            Response.AddPagination(stream.CurrentPage, stream.PageSize, stream.TotalCount, stream.TotalPages);

            return Ok(streamDto);
        }

        [HttpGet("{username}/posts")]
        public async Task<IActionResult> GetUserPosts(string username, [FromQuery]PaginationParams paginationParams)
        {
            var user = await _repo.GetUser(username);

            if (user == null)
                return NotFound();

            if (!await followsPrivateUser(user))
                return Ok();

            var posts = await _repo.GetPosts(user.Id, paginationParams);
            var postsDto = _mapper.Map<IEnumerable<PostReturnDto>>(posts);

            Response.AddPagination(posts.CurrentPage, posts.PageSize, posts.TotalCount, posts.TotalPages);

            return Ok(postsDto);
        }

        private async Task<bool> followsPrivateUser(User user)
        {
            if (!user.IsPrivate)
                return true;

            int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out int currentUserId);

            if (currentUserId == 0)
                return false;

            if (currentUserId != user.Id)
            {
                var followerIds = (await _repo.GetAllFollowers(user.Id)).Select(u => u.Id);
                if (!followerIds.Contains(currentUserId))
                    return false;
            }

            return true;
        }        
    }
}
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;
using SqrShrAPI.Data.Interfaces;
using SqrShrAPI.Dtos.Media;
using SqrShrAPI.Dtos.Post;
using SqrShrAPI.Dtos.User;
using SqrShrAPI.Interfaces;
using SqrShrAPI.Models;
using SqrShrAPI.Util;

namespace SqrShrAPI.Controllers
{
    [ServiceFilter(typeof(UpdateUserLastActivityDate))]
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ISqrShrRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;
        public PostsController(ISqrShrRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _repo = repo;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;

            Account account = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }

        [HttpGet("{id}", Name = "GetPost")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _repo.GetPost(id);

            if (post == null)
                return NotFound();

            var postDto = _mapper.Map<PostReturnDto>(post);

            return Ok(postDto);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _repo.GetPost(id);

            if (post == null)
                return NotFound();

            if (post.User.Username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();

            post.IsDeleted = true;

            if (await _repo.SaveAll())
            {
                return Ok();
            }

            return BadRequest("Couldn't delete post");
        }

        [Authorize]
        [HttpPost("{username}")]
        public async Task<IActionResult> SubmitPost(string username, PostUploadDto postUploadDto)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();

            var user = await _repo.GetUser(username);

            if (user == null)
                return NotFound();

            var post = new Post
            {
                UserId = user.Id,
                Content = postUploadDto.Content
            };

            _repo.Add(post);

            if (await _repo.SaveAll())
            {
                var postReturnDto = _mapper.Map<PostReturnDto>(post);
                return Ok(postReturnDto);
            }

            return BadRequest("Couldn't upload post");
        }

        [Authorize]
        [HttpPost("{id}/image")]
        public async Task<IActionResult> AddPostImage(int id, ImageUploadDto imageUploadDto)
        {
            var post = await _repo.GetPost(id);

            if (post == null) 
                return NotFound();

            if (post.User.Username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();

            var base64string = imageUploadDto.base64string.Substring(imageUploadDto.base64string.IndexOf(",") + 1);
            byte[] bytes = Convert.FromBase64String(base64string);

            var uploadResult = new ImageUploadResult();

            if (bytes.Length > 0)
            {
                using (Stream stream = new MemoryStream(bytes))
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        Folder = "post_images/" + post.User.Id.ToString(),
                        Format = "jpg",
                        File = new FileDescription("postimage", stream),
                        Transformation = new Transformation().Width(500).Height(500)
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            PostImage postImage = new PostImage();
            postImage.Url = uploadResult.Uri.ToString();
            postImage.PublicId = uploadResult.PublicId;

            post.PostImages.Add(postImage);

            if (await _repo.SaveAll())
            {
                return CreatedAtRoute("GetPost", new { id = post.Id }, _mapper.Map<PostReturnDto>(post));
            }
            
            return null;
        }

        [HttpGet("{postId}/vote/{username}")]
        public async Task<IActionResult> GetUserPostVote(int postId, string username)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();

            var user = await _repo.GetUser(username);

            if (user == null)
                return NotFound();

            var vote = await _repo.GetPostVote(user.Id, postId);

            return Ok(vote);
        }

        [HttpGet("comments/{commentId}/vote/{username}")]
        public async Task<IActionResult> GetUserCommentVote(int commentId, string username)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();

            var user = await _repo.GetUser(username);

            if (user == null)
                return NotFound();

            var vote = await _repo.GetCommentVote(user.Id, commentId);

            return Ok(vote);
        }

        [Authorize]
        [HttpPost("{postId}/vote")]
        public async Task<IActionResult> SubmitPostVote(int postId, VoteUploadDto voteUploadDto)
        {
            var parent = await _repo.GetPost(postId);

            if (parent == null)
                return NotFound();

            return await SubmitVote(parent, voteUploadDto);
        }

        [Authorize]
        [HttpPost("comments/{commentId}/vote")]
        public async Task<IActionResult> SubmitCommentVote(int commentId, VoteUploadDto voteUploadDto)
        {
            var parent = await _repo.GetComment(commentId);

            if (parent == null)
                return NotFound();

            return await SubmitVote(parent, voteUploadDto);
        }

        [HttpPost("")]

        [Authorize]
        [HttpPost("{id}/comment")]
        public async Task<IActionResult> SubmitPostComment(int id, CommentUploadDto commentUploadDto)
        {
            var post = await _repo.GetPost(id);

            if (post == null)
                return NotFound();

            var comment = await AddComment(post, commentUploadDto);

            if (comment != null)
            {
                var commentDto = _mapper.Map<CommentReturnDto>(comment);
                return Ok(commentDto);
            }

            return BadRequest("Couldn't upload comment");
        }

        [Authorize]
        [HttpPost("comments/{id}")]
        public async Task<IActionResult> SubmitCommentComment(int id, CommentUploadDto commentUploadDto)
        {
            var comment = await _repo.GetComment(id);

            if (comment == null)
                return NotFound();

            var newComment = await AddComment(comment, commentUploadDto);

            if (newComment != null)
            {
                var commentDto = _mapper.Map<CommentReturnDto>(newComment);
                return Ok(commentDto);
            }

            return BadRequest("Couldn't upload comment");
        }

        private async Task<Comment> AddComment(ICommentable parent, CommentUploadDto commentUploadDto)
        {
            if (User.FindFirst(ClaimTypes.Name) == null)
                return null;
            
            var user = await _repo.GetUser(User.FindFirst(ClaimTypes.Name).Value);

            if (user == null)
                return null;

            var comment = new Comment()
            {
                UserId = user.Id,
                Content = commentUploadDto.Content
            };

            parent.Comments.Add(comment);

            if (await _repo.SaveAll())
                return comment;

            return null;
        }

        private async Task<ActionResult> SubmitVote(IVotable parent, VoteUploadDto voteUploadDto)
        {
            if (User.FindFirst(ClaimTypes.Name) == null)
                return Unauthorized();
            
            var user = await _repo.GetUser(User.FindFirst(ClaimTypes.Name).Value);

            if (user == null)
                return NotFound();

            var vote = (parent is Post) ? await _repo.GetPostVote(user.Id, parent.Id) : await _repo.GetCommentVote(user.Id, parent.Id);

            if (vote != null && vote.Upvote == voteUploadDto.Upvote)
            {
                _repo.Delete(vote);
                if (await _repo.SaveAll())
                {
                    return Ok();
                }
            }

            else if (vote != null)
            {
                vote.Upvote = voteUploadDto.Upvote;
            }

            else
            {
                vote = new Vote
                {
                    User = user,
                    Post = (parent is Post) ? (Post)parent : null,
                    Comment = (parent is Comment) ? (Comment)parent : null,
                    Upvote = voteUploadDto.Upvote
                };

                _repo.Add(vote);
            }

            if (await _repo.SaveAll())
                return Ok(vote);

            return BadRequest("Error submitting vote");
        }
    }
}
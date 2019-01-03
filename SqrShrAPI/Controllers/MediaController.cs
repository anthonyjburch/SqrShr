using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using SqrShrAPI.Data.Interfaces;
using SqrShrAPI.Dtos.Media;
using SqrShrAPI.Models;
using SqrShrAPI.Util;

namespace SqrShrAPI.Controllers
{
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly ISqrShrRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public MediaController(ISqrShrRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
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

        [HttpGet("api/users/{username}/profileimage", Name = "GetProfileImage")]
        public async Task<IActionResult> GetUserProfileImage(string username)
        {
            var user =  await _repo.GetUser(username);
            var img = user.ProfileImages.FirstOrDefault(i => i.Current);
            
            if (img == null)
                return NotFound();

            var imgToReturn = _mapper.Map<ProfileImageReturnDto>(img);

            return Ok(imgToReturn);
        }

        [Authorize]
        [HttpGet("api/users/{username}/profileimages")]
        public async Task<IActionResult> GetUserProfileImages(string username)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();

            var user = await _repo.GetUser(username);
            var imgs = user.ProfileImages.Where(i => !i.IsDeleted).OrderByDescending(i => i.Current).ThenByDescending(i => i.DateAdded).ToList();

            if (imgs.Count() == 0)
                return NoContent();

            var imgsToReturn = _mapper.Map<IEnumerable<ProfileImageReturnDto>>(imgs);
            return Ok(imgsToReturn);
        }

        [Authorize]
        [HttpPut("api/users/{username}/profileimage")]
        public async Task<IActionResult> SetUserProfileImage(string username, ProfileImageSetDto profileImageSetDto)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(username);

            var newProfileImage = userFromRepo.ProfileImages.FirstOrDefault(i => i.Id == profileImageSetDto.Id);
            
            if (newProfileImage == null)
                return NotFound();

            

            var currentProfileImage = userFromRepo.ProfileImages.FirstOrDefault(i => i.Current);
            if (currentProfileImage != null)
                currentProfileImage.Current = false;

            newProfileImage.Current = true;

            if (await _repo.SaveAll())
            {
                var imageToReturn = _mapper.Map<ProfileImageReturnDto>(newProfileImage);
                return AcceptedAtRoute("GetProfileImage", new { id = newProfileImage.Id }, imageToReturn);
            }

            return BadRequest("Error updating profile image");
        }

        [Authorize]
        [HttpDelete("api/users/{username}/profileimage/{id}")]
        public async Task<IActionResult> DeleteUserProfileImage(string username, int id)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();

            var user = await _repo.GetUser(username);

            if (!user.ProfileImages.Any(i => i.Id == id))
                return Unauthorized();

            var image = await _repo.GetProfileImage(id);

            if (image.Current)
                return BadRequest("Cannot delete profile image.");

            image.IsDeleted = true;

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Error deleting profile image");
        }   

        [Authorize]
        [HttpPost("api/users/{username}/profileimage")]
        public async Task<IActionResult> AddUserProfileImage(string username, ImageUploadDto profileImageUploadDto)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
            return Unauthorized();

            var userFromRepo = await _repo.GetUser(username);

            var base64string = profileImageUploadDto.base64string.Substring(profileImageUploadDto.base64string.IndexOf(",") + 1);
            byte[] bytes = Convert.FromBase64String(base64string);
            
            var uploadResult = new ImageUploadResult();

            if (bytes.Length > 0)
            {
                using (Stream stream = new MemoryStream(bytes))
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        Folder = "profile_images/" + userFromRepo.Id.ToString(),
                        Format = "jpg",
                        File = new FileDescription("profileimage", stream),
                        Transformation = new Transformation().Width(500).Height(500)
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            var profileImage = new ProfileImage();


            profileImage.Url = uploadResult.Uri.ToString();
            profileImage.PublicId = uploadResult.PublicId;

            var currentProfileImage = userFromRepo.ProfileImages.FirstOrDefault(i => i.Current);
            if (currentProfileImage != null)
                currentProfileImage.Current = false;

            profileImage.Current = true;

            userFromRepo.ProfileImages.Add(profileImage);

            if (await _repo.SaveAll())
            {
                var profileImageToReturn = _mapper.Map<ProfileImageReturnDto>(profileImage);
                return CreatedAtRoute("GetProfileImage", new { id = profileImage.Id }, profileImageToReturn);
            }

            return BadRequest("Error uploading profile image.");
        }

        [Authorize]
        [RequestSizeLimit(int.MaxValue)]
        [HttpPost("api/posts/getpostimagepreview")]
        public IActionResult GetPostImagePreview()
        {
            var file = Request.Form.Files.First();
            var outputStream = new MemoryStream();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var image = Image.Load(stream);
                    image.Mutate(img => img.Resize(75, 75));
                    image.Save(outputStream, new JpegEncoder());
                }
            }

            var array = outputStream.ToArray();
            return Ok(array);
        }
    }
}
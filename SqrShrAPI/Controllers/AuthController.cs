using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SqrShrAPI.Data.Interfaces;
using SqrShrAPI.Dtos.User;
using SqrShrAPI.Models;
using SqrShrAPI.Util;

namespace SqrShrAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _repo = repo;
            _config = config;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto userRegisterDto)
        {
            if (await _repo.UserExists(userRegisterDto.Username))
                return BadRequest("Username already exists");

            var userToCreate = new User
            {
                Username = userRegisterDto.Username,
                Email = userRegisterDto.Email
            };

            var createdUser = await _repo.Register(userToCreate, userRegisterDto.Password);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            var userFromRepo = await _repo.Login(userLoginDto.Username, userLoginDto.Password);

            if (userFromRepo == null)
                return Unauthorized();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var user = _mapper.Map<UserLoginReturnDto>(userFromRepo);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                user
            });
        }

        [HttpPost("updatepassword")]
        public async Task<IActionResult> UpdatePassword(UserPasswordUpdateDto userPasswordUpdateDto)
        {
            var user = await _repo.Login(userPasswordUpdateDto.Username, userPasswordUpdateDto.CurrentPassword);

            if (user == null)
                return Unauthorized();

            user = await _repo.UpdatePassword(userPasswordUpdateDto.Username, userPasswordUpdateDto.CurrentPassword, userPasswordUpdateDto.NewPassword);

            return Ok();
        }

        [HttpPost("deleteuser")]
        public async Task<IActionResult> DeleteUser(UserDeleteDto userDeleteDto)
        {
            var user = await _repo.Login(userDeleteDto.Username, userDeleteDto.Password);

            if (user == null)
                return Unauthorized();

            user = await _repo.DeleteUser(user);

            return Ok();
        }
    }
}
using Asp.Versioning;
using FindMinPathApi.Dto;
using FindMinPathApi.Filters;
using FindMinPathApi.Helpers;
using Infrastructure.FindMinPath.Interfaces;
using Infrastructure.FindMinPath.Models;
using Infrastructure.FindMinPath.Requests;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Net.WebSockets;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace FindMinPathApi.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/maps")]
    [ApiVersion("1.0")]
    [TypeFilter(typeof(ApiResponseWrapperResultFilter))]
    public class FindMinPathController : ControllerBase
    {
        private readonly IRepositoryManager _repositoryManager;

        public FindMinPathController(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetMaps(int page = 0, int size = 1)
        {
            var data = await _repositoryManager.Map.GetAllMapsAsync(false, page, size);

            return Ok(data.ToList());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMapDetail(int mapId)
        {
            var data = await _repositoryManager.MapDetail.GetMapDetailAsync(mapId, false);

            return Ok(data);
        }


        [HttpPost]
        public async Task<IActionResult> CreateMap([FromBody] MapForCreationDto map)
        {
            if (map.n < 1 && map.m > 500 && map.p < 1 && map.p > map.n * map.m)
            {
                return BadRequest("Invalid params!");
            }

            var data = new Map
            {
                Name = map.name,
                Rows = map.n,
                Columns = map.m,
                Boxs = map.p,
                MatrixJson = map.matrixJson,
                CreatedDate = DateTime.Now,
                ModifiedDate = null
            };

            try
            {
                _repositoryManager.Map.CreateMap(data);
                await _repositoryManager.SaveAsync();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }



            return Ok("Save success!");
        }

        [HttpPut("{id}")]
        public ActionResult EditMap(int row, int column, int p)
        {
            if (row < 1 && column > 500 && p < 1 && p > row * column)
            {
                return BadRequest("Invalid params!");
            }


            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMap(int id)
        {
            if (id < 0)
            {
                return BadRequest("Invalid params!");
            }

            var map = await _repositoryManager.Map.GetMapAsync(id, false);

            if (map is not null)
            {
                _repositoryManager.Map.DeleteMap(map);
                await _repositoryManager.SaveAsync();
            }
            else
            {
                return NotFound("Not found map!");
            }

            return Ok("Delete map success!");
        }

        [HttpPost("calculateMinFuel")]
        public async Task<IActionResult> CalculateMinFuel(int mapId)
        {
            if (mapId < 0)
            {
                return BadRequest("Invalid params!");
            }

            var mapInfo = await _repositoryManager.Map.GetMapAsync(mapId, false);

            if (mapInfo is null) return BadRequest("Map does not exists!");

            //var matrix = MatrixGenerator.GenerateMatrix(mapInfo.Rows, mapInfo.Columns, mapInfo.Boxs);
            var matrix = MatrixSerializer.FromJson(mapInfo.MatrixJson);

            var minFuel = TreasureFinder.CalculateMinFuel(matrix, mapInfo.Rows, mapInfo.Columns, mapInfo.Boxs);

            var data = new MapDetail
            {
                MapId = mapId,
                MinFuel = minFuel,
                CreatedDate = DateTime.Now,
                ModifiedDate = null
            };

            try
            {
                var detail = await _repositoryManager.MapDetail.GetMapDetailByMapIdAsync(mapInfo.Id, false);

                if (detail is null)
                {
                    _repositoryManager.MapDetail.CreateMap(data);
                    await _repositoryManager.SaveAsync();
                }

            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }

            return Ok(minFuel);
        }
    }
}

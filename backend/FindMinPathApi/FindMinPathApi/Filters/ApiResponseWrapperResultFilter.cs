using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace FindMinPathApi.Filters
{
    public class ApiResponseWrapperResultFilter : IResultFilter
    {
        public void OnResultExecuting(ResultExecutingContext context)
        {
            if (context.Result is ObjectResult objectResult)
            {
                var wrappedResponse = new
                {
                    Status = objectResult.StatusCode ?? 200,
                    Message = objectResult.StatusCode == 200 ? "Success" : "Error",
                    Data = objectResult.Value
                };

                // Replace the original action result with a new JsonResult wrapping the above structure
                // Maintain the original status code on the new JsonResult
                context.Result = new JsonResult(wrappedResponse)
                {
                    StatusCode = objectResult.StatusCode
                };
            }
            else if (context.Result is EmptyResult)
            {
                // Wrap it with a standard response indicating to content.
                // Wrap it with a standard response indicating no content
                var wrappedResponse = new
                {
                    Status = 204,               // HTTP 204 No Content status code
                    Message = "No Content",    // Informative message
                    Data = (object?)null       // Data is null
                };
                // Replace EmptyResult with a JsonResult to maintain consistent response format
                context.Result = new JsonResult(wrappedResponse)
                {
                    StatusCode = 204           // Set HTTP status to 204 No Content
                };
            }
        }

        // This method runs after the result has been executed (after response is sent)
        public void OnResultExecuted(ResultExecutedContext context)
        {
            // This is optional for post-result processing and currently left empty
        }
    }
}

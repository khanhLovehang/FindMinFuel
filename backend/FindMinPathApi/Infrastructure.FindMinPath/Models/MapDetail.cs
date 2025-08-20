using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FindMinPath.Models
{
    public class MapDetail
    {
        [Key]
        public int Id { get; set; }
        public int MapId { get; set; }
        public double MinFuel { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        [ForeignKey("MapId")]
        public Map Map { get; set; }
    }
}

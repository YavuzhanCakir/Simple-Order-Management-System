using Core.Entities;
using Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Concrete
{
    public class Product : BaseEntity, IEntity
    {
        public string Name { get; set; }
        public int ColorId { get; set; }

        public SizeEnum Size { get; set; }

    }
}

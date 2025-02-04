﻿using Core.Entities;
using Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Concrete
{
    public class Depo : BaseEntity, IEntity
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int ColorId { get; set; }
        public SizeEnum Size { get; set; }
        public int Quantity { get; set; }
    }
}

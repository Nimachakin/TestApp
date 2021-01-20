using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestApp.Models
{
    public class VirtualServerInfo
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int VirtualServerId { get; set; }
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:mm:ss}")]
        public DateTime CreateDateTime { get; set; }
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:mm:ss}")]
        public DateTime? RemoveDateTime { get; set; }
        public bool SelectedForRemove { get; set; }
    }
}
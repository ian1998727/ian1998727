using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Npgsql;


namespace ConsoleApplication3
{
    
    class Program
    {
        static void Main(string[] args)
        {
            string ASA = "55";
            NpgsqlConnection conn = new NpgsqlConnection("Server=ec2-174-129-231-116.compute-1.amazonaws.com ; Port=5432;User Id=mmopgvcydqshfc; Password=7396c6f1ba66851eb89182c71e5509028d66e81b07f44e055ad22877d9acb89e;Database=df3btm29r94oaq;SslMode=Require;");
            conn.Open();
            NpgsqlCommand command =
                new NpgsqlCommand("INSERT INTO score VALUES (22,"+ASA+",12.01,106.34,25.55,12.25,100.45);", conn);
            NpgsqlDataReader reader = command.ExecuteReader();
            conn.Close();
            
        }
    }
}
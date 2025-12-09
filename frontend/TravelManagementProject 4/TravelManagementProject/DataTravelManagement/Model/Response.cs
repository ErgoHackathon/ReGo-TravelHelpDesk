

namespace DataTravelManagement.Model
{
    public class Response<T>
    {
        public string Status { get; set; }
        public T Result { get; set; }
    }
}

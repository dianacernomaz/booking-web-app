using AutoMapper;
using MyProject.BusinessLayer.Interfaces;
using MyProject.BusinessLayer.Structure;

namespace MyProject.BusinessLayer
{
    public class BusinessLogic
    {
        private static readonly IMapper _mapper;

        static BusinessLogic()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });
            _mapper = config.CreateMapper();
        }

        public BusinessLogic() { }

        public static IMapper Mapper => _mapper;

        public IAuthAction AuthAction()
        {
            return new AuthActionExecution();
        }

        public IPropertyAction PropertyAction()
        {
            return new PropertyActionExecution();
        }

        public IBookingAction BookingAction()
        {
            return new BookingActionExecution();
        }
    }
}

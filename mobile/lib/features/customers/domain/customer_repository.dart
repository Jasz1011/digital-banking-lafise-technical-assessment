import 'customer.dart';

abstract interface class CustomerRepository {
  Future<Customer> createCustomer(CreateCustomerInput input);
}

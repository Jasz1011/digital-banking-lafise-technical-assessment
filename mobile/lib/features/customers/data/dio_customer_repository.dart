import '../../../core/api/banking_api_client.dart';
import '../domain/customer.dart';
import '../domain/customer_repository.dart';

class DioCustomerRepository implements CustomerRepository {
  const DioCustomerRepository(this._client);

  final BankingApiClient _client;

  @override
  Future<Customer> createCustomer(CreateCustomerInput input) async {
    final json = await _client.postObject('/api/customers', input.toJson());
    return Customer.fromJson(json);
  }
}

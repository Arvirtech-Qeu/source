enum NetworkStatus {
  idle,
  loading,
  success,
  error
}

class NetworkState<T> {
final NetworkStatus status;
final T? data;
final String? error;

NetworkState._({required this.status, this.data, this.error});

factory NetworkState.idle() => NetworkState._(status:NetworkStatus.idle);

factory NetworkState.loading() => NetworkState._(status: NetworkStatus.loading);

factory NetworkState.success(T data) =>
    NetworkState._(status: NetworkStatus.success, data: data);

factory NetworkState.error(String error) =>
    NetworkState._(status: NetworkStatus.error, error: error);

}
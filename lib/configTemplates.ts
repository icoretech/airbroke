export const rubyTemplate = `
Airbrake.configure do |config|
  def set_if_responds_to(config, method_name, value)
    config.send("#{method_name}=", value) if config.respond_to?(method_name)
  end

  config.error_host = 'https://airbroke.mydomain.com'
  config.project_id = 1 # any number will do
  config.project_key = {REPLACE_PROJECT_KEY}
  config.environment = Rails.env
  config.ignore_environments = %w[development test]

  set_if_responds_to(config, :performance_stats, false)
  set_if_responds_to(config, :query_stats, false)
  set_if_responds_to(config, :remote_config_host, nil)
  set_if_responds_to(config, :apm_host, nil)
  set_if_responds_to(config, :remote_config, false)
  set_if_responds_to(config, :job_stats, false)

  config.root_directory = '/app' if Rails.env.production? || Rails.env.staging?
end

Airbrake.add_filter do |notice|
  ignored_exceptions = [ActiveRecord::ConcurrentMigrationError, Sidekiq::Shutdown, PG::ConnectionBad]

  if notice.stash[:exception] && ignored_exceptions.any? { |klass| notice.stash[:exception].is_a?(klass) }
    notice.ignore!
  end

  if request = notice.stash[:rack_request]
    notice[:params][:remote_ip] = request.env['REMOTE_IP']
  end
end
`;

export const jsclientTemplate = `
import { Notifier } from '@airbrake/browser';

const airbrake = new Notifier({
  projectKey: '{REPLACE_PROJECT_KEY}',
  host: 'https://airbroke.mydomain.com',
  remoteConfig: false,
  projectId: 1, // any number will do
  environment: 'production',
});
`;

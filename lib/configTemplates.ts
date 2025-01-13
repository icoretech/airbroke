// lib/configTemplates.ts

//
// Ruby / Rails
//
export const rubyTemplate = `
# config/initializers/airbroke.rb
Airbrake.configure do |config|
  def set_if_responds_to(config, method_name, value)
    config.send("\#{method_name}=", value) if config.respond_to?(method_name)
  end

  config.error_host = 'https://airbroke.mydomain.com'
  config.project_id = 1 # any number will do
  config.project_key = '{REPLACE_PROJECT_KEY}'
  config.environment = Rails.env
  config.ignore_environments = %w[development test]

  # These lines ensure no performance stats or remote configs are used
  set_if_responds_to(config, :performance_stats, false)
  set_if_responds_to(config, :query_stats, false)
  set_if_responds_to(config, :remote_config_host, nil)
  set_if_responds_to(config, :apm_host, nil)
  set_if_responds_to(config, :remote_config, false)
  set_if_responds_to(config, :job_stats, false)
  set_if_responds_to(config, :queue_stats, false)

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

//
// JavaScript (Browser)
//
export const jsclientTemplate = `
import { Notifier } from '@airbrake/browser';

const airbrake = new Notifier({
  projectId: 1, // any number will do
  projectKey: '{REPLACE_PROJECT_KEY}',
  environment: 'production',
  host: 'https://airbroke.mydomain.com',
  remoteConfig: false,
  performanceStats: false,
  queryStats: false,
  queueStats: false,
});
`;

//
// JavaScript (Node.js)
//
export const nodejsclientTemplate = `
import { Notifier } from '@airbrake/node';

const airbrake = new Notifier({
  projectId: 1, // any number will do
  projectKey: '{REPLACE_PROJECT_KEY}',
  environment: 'production',
  host: 'https://airbroke.mydomain.com',
  remoteConfig: false,
  performanceStats: false,
  queryStats: false,
  queueStats: false,
});
`;

//
// Python (Generic or Django)
//
export const pythonTemplate = `
import pybrake

notifier = pybrake.Notifier(
    project_id=123,         # any number will do
    project_key='{REPLACE_PROJECT_KEY}',
    environment='production',
    performance_stats=False,
    query_stats=False,
    queue_stats=False,
)
`;

//
// iOS / Swift
//
export const iosSwiftTemplate = `
// In your Podfile (iOS):
// use_frameworks!
// pod 'Airbrake-iOS'

import Airbrake_iOS

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

  func application(_ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    ABNotifier.startNotifier(withAPIKey: "{REPLACE_PROJECT_KEY}",
      projectID: "12345",
      environmentName: ABNotifierAutomaticEnvironment,
      useSSL: true
    )

    return true
  }
}
`;

//
// iOS / Objective-C
//
export const iosObjectiveCTemplate = `
#import "ABNotifier.h"

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [ABNotifier startNotifierWithAPIKey:@"{REPLACE_PROJECT_KEY}"
                              projectID:@"12345"
                        environmentName:ABNotifierAutomaticEnvironment
                               delegate:self];

    return YES;
}
`;

//
// Android
//
export const androidTemplate = `
import com.loopj.android.airbrake.AirbrakeNotifier;

public class MainActivity extends Activity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    AirbrakeNotifier.register(this, "{REPLACE_PROJECT_KEY}", "production");
  }
}
`;

//
// .NET / C#
export const dotNetTemplate = `
// using Sharpbrake (the official .NET library for Airbrake-compatible servers)

var config = new AirbrakeConfig {
    ProjectId = "12345",
    ProjectKey = "{REPLACE_PROJECT_KEY}",
    Environment = "production"
    // If Sharpbrake supports performance options, set them to false if needed
};

var notifier = new AirbrakeNotifier(config);
`;

//
// Go (gobrake)
//
export const goTemplate = `
// Install
// go get github.com/airbrake/gobrake/v5

import (
  "github.com/airbrake/gobrake/v5"
  "log"
)

var airbrake = gobrake.NewNotifierWithOptions(&gobrake.NotifierOptions{
  ProjectId:   12345,
  ProjectKey:  "{REPLACE_PROJECT_KEY}",
  Environment: "production",

  // If needed, disable performance stats:
  // PerformanceStats: false,
})
`;

//
// Java
//
export const javaTemplate = `
// build.gradle
// implementation 'io.airbrake:javabrake:0.3.0'

// using Javabrake
import io.airbrake.javabrake.Notifier;
import io.airbrake.javabrake.Config;

public class Example {
  public static void main(String[] args) {
    Config config = new Config();
    config.projectId = 12345;
    config.projectKey = "{REPLACE_PROJECT_KEY}";
    config.environment = "production";

    Notifier notifier = new Notifier(config);
  }
}
`;

//
// PHP
//
export const phpTemplate = `
composer require airbrake/phpbrake

<?php

$notifier = new Airbrake\\Notifier([
    'projectId' => 12345,
    'projectKey' => '{REPLACE_PROJECT_KEY}',
    'environment' => 'production'
]);

Airbrake\\Instance::set($notifier);

$handler = new Airbrake\\ErrorHandler($notifier);
$handler->register();
`;

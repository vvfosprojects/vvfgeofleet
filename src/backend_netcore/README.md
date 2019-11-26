# RockApi: a SOLID oriented, CQRS compliant WebApi RESTful template

## Introduction

RockApi is a template project that can be used as a startup project to write RESTful backends which follow the [SOLID methodology](https://en.wikipedia.org/wiki/SOLID) and are compliant to the [CQRS paradigm](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation). It is implemented in .NET core WebApi.

RockApi starts from the assumption that a backend exposes a set of actions belonging to one of those two groups:

* **queries**: don't mutate the state of the system and return a result;
* **commands**: mutate the state of the system and don't return any result.

This scheme is very common in enterprise level applications, as described [here](https://blogs.cuttingedge.it/steven/posts/2011/meanwhile-on-the-command-side-of-my-architecture/) and [here](https://blogs.cuttingedge.it/steven/posts/2011/meanwhile-on-the-query-side-of-my-architecture/).

Beside the difference between commands and queries, a RESTful backend must also handle a common set of cross-cutting concerns, as described below.

### Logging

On each action execution, it is important to log the following information:

* **when** the action is being executed;
* **who** executes the action;
* **what** action is being executed;
* **what** data the action is being executed with.

**RockApi logs all this information**, thus enabling a *who-does-what-when* log, which has a great value for auditing, debugging, application profiling. By appropriately configuring the log functionality, it is easy to log to a file, to the network, to a database, etc.

### Action validation

Before each action, a validation phase must be executed against the provided [DTO](https://en.wikipedia.org/wiki/Data_transfer_object), in order to prevent firing the action with invalid or insecure data.

In RockApi, this aspect is treated as a cross-cutting concern: classes in charge of validation are in all respects *plain classes* having just to inherit from a base validation class. As such, they are **automatically injected** in the action execution chain, so making difficult to forget the validation phase.

### Action authorization

Similarly to validation, an authorization phase must be executed for each action, in order to enforce authorization policies, and thus preventing unauthorized use of the system.

As for validation, in RockApi, classes in charge of authorization are plain classes deriving from a base authorization class. As such they are **automatically injected** in the action execution chain.

### Notification

Modern enterprise applications are not standalone. They are pieces belonging to a complex ecosystem where each application can use services provided by other applications and must supply services to other applications, in an integrated fashion.

By definition, a command execution implies a change in the state of the system. In case one or more systems must receive a notification about this change, one or more classes can be written in charge of notifying this change. Most common such cases are the following:

* notifying web clients via webSocket (i.e. push notification);
* notifying third party full-text search engines to trigger the re-indexing of an entity;
* triggering alarms in case of anomalous states;
* notifying depending third party systems to reflect the new state of an entity (ugly, but...).

In the same way as validation and authorization, **RockApi actions explicitly implement a notification phase**, treating it as a cross-cutting concern.

### Performance evaluation

RockApi automatically computes the time spent for each action to be executed. This allows to continuously track the system performance, locate bottlenecks, profile and compare the time spent by system functionalities.

## The action execution chain

In RockApi, all the phases described above compose an *action execution chain*, described by the picture below.

![Action execution chain](/docs/ActionChain.png)

In the picture, the actual command/query is executed by the red block. All the other blocks handle *aspects*. Some of these are general aspects, in the sense that they do not depend on the specific action being executed. Thus, they can be considered in all respects as cross-cutting concerns, in the strict sense of definition. In the picture they are represented with gray-shaded background and are related to log functionalities. The remaining blocks, represented with blue-shaded background, refer to other aspects which depend on the concrete action being executed. Thus, a specific class must be written for each one of these phases and for each different action: they can be considered cross-cutting concerns only in a broad sense.

In RockApi, the described cross-cutting concerns can be individually configured, according to the environments the backend runs within. For example, there is a section specifically dedicated to configure the logging: the log writes to the trace log, but it can be easily configured to write to the console, or to a file using a specific log-rotating strategy.

## Understanding RockApi

Though RockApi is built to be used in real-world scenarios, it is written also with an educational intent. Each commit is very small and the commit message explains in great detail, step by step, what has been done and why. *Service* commits have been avoided whenever possible through rebasing. So for *fix* and *meaningless* commits.

Following the commit history, you can reach a very good comprehension about the application infrastructure, the choices made, the motivations, the PROs to use such an architecture.

## Libraries used

RockApi uses [Simple Injector](https://simpleinjector.org/index.html) library to implement the Dependency Inversion principle, according to the SOLID methodology. The great support for generics allows to have a crystal clear infrastructure for injecting action phases as cross-cutting concerns, making heavy use of the [decorator pattern](https://en.wikipedia.org/wiki/Decorator_pattern).

Logging is implemented by using the [Serilog](https://serilog.net/) library. It is highly configurable through a great number of plugins.

[NUnit](https://nunit.org/) is used to implement unit tests.

CQRS principle is implemented by using plain classes and did not request for including any external library.

## Developing with RockApi

RockApi has a branch called `production_ready`. You can use this branch to start a real-world project. All the classes written just for educational purposes have been removed from this branch.

Once cloned the RockApi repository, it is time to add commands and queries to implement the desired functionalities. Commands and queries can be added in the DomainModel project, below the CQRS folder.

### Adding a command

Adding a command requests at least for:

* an input DTO;
* a command handler.

Validation, authorization and notification are optional. In case of need, one or more classes can be created for each one of these concerns.

#### Input DTO

A command can be created by defining the DTO first:

```c#
public class MyNewCommand
{
    public string Foo { get; set; }
    public string Bar { get; set; }
}
```

#### Command handler

Then, the command handler must be created:

```c#
public class MyNewCommandHandler : ICommandHandler<MyNewCommand>
{
    public void Handle(MyNewCommand command)
    {
        // Implementation here
    }
}
```

#### Validation (optional)

DTO validation can be added simply by creating a class like this:

```c#
public class MyNewCommandValidator : ICommandValidator<MyNewCommand>
{
    public IEnumerable<ValidationResult> Validate(MyNewCommand command)
    {
        // Here the validation
        // In case of failure you must return a ValidationResult
        yield return new ValidationResult("Failure message");
        
        //otherwise, return an empty enumerable
    }
}
```

The class is automatically inserted in the action execution chain. If the validation is composed of multiple steps, many validation classes can be created, which are all executed in the chain.

#### Authorization (optional)

Action authorization can be implemented simply by creating a class like this:

```c#
public class MyNewCommandAuthorizer : ICommandAuthorizer<MyNewCommand>
{
    public IEnumerable<AuthorizationResult> Authorize(MyNewCommand command)
    {
        // Here the authorization code
        // If the authorization fails, you must return an AuthorizationResult
        yield return new AuthorizationResult("Authorization fails");
        
        // otherwise, return an empty enumerable
    }
}
```

The class is automatically inserted in the action execution chain. Also in this case, should the authorization be composed of multiple steps, many authorization classes can be created and they are all wired in the execution chain.

#### Notification (optional)

The command notification can be implemented simply by creating a class like this:

```c#
public class AddUserFakeNotifier : ICommandNotifier<AddUserFakeCommand>
{
    public void Notify(AddUserFakeCommand command)
    {
        // Here we implement the notification.
        //
        // Note that, obviously, this class might inject
        // other services via constructor injection to
        // carry out his notification.
    }
}
```

The class is automatically inserted in the action execution chain. As always, should the notification be composed of multiple steps, many notification classes can be created and they are all wired in the execution chain.

#### Exposing the command through a WebApi controller

When all the command classes are set up, the command must be exposed through a WebApi controller. After creating a plain WebApi controller, you have to inject the command through [constructor injection](https://en.wikipedia.org/wiki/Dependency_injection#Constructor_injection), as follows:

```c#
[Route("api/[controller]")]
[ApiController]
public class MyNewController : ControllerBase
{
    private readonly ICommandHandler<MyNewCommand> handler;

    public MyNewController(ICommandHandler<MyNewCommand> handler)
    {
        this.handler = handler ?? throw new ArgumentNullException(nameof(handler));
    }

    // POST: api/MyNew
    [HttpPost]
    public void Post([FromBody] MyNewCommand command)
    {
        handler.Handle(command);
    }
}
```

That's all!

The command is now bound and it can be fired by sending a POST message to the RESTful backend.

Note how the written code has almost nothing to do with infrastructural issues. It belongs to the DomainModel and, thus, has a high value added.

### Adding a query

Adding a query requests at least for:

* an input DTO;
* an output DTO;
* a query handler.

Validation, authorization and notification are optional. In case of need, one or more classes can be created for each one of these concerns.

#### Input DTO

A query can be created by defining the input DTO first:

```c#
public class MyNewQuery : IQuery<MyNewQueryResult>
{
    public string Foo { get; set; }
    public string Bar { get; set; }
}
```

#### Output DTO

Beside the input DTO, queries have an output DTO as well:

```c#
public class MyNewQueryResult
{
    public string FooBar { get; set; }
    public string BarFoo { get; set; }
}
```

#### Query handler

Then, the query handler must be created:

```c#
public class MyNewQuerydHandler : IQueryHandler<MyNewQuery, MyNewQueryResult>
{
    public MyNewQueryResult Handle(MyNewQuery query)
    {
        // Implementation here
    }
}
```

#### Validation (optional)

DTO validation can be added simply by creating a class like this:

```c#
public class MyNewQueryValidator : IQueryValidator<MyNewQuery, MyNewQueryResult>
{
    public IEnumerable<ValidationResult> Validate(MyNewQuery query)
    {
        // Here the validation
        // In case of failure you must return a ValidationResult
        yield return new ValidationResult("Failure message");
        
        //otherwise, return an empty enumerable
    }
}
```

The class is automatically inserted in the action execution chain. If the validation is composed of multiple steps, many validation classes can be created, which are all executed in the chain.

#### Authorization (optional)

Action authorization can be implemented simply by creating a class like this:

```c#
public class MyNewQueryAuthorizer : IQueryAuthorizer<MyNewQuery, MyNewQueryResult>
{
    public IEnumerable<AuthorizationResult> Authorize(MyNewQuery query)
    {
        // Here the authorization code
        // If the authorization fails, you must return an AuthorizationResult
        yield return new AuthorizationResult("Authorization fails");
        
        // otherwise, return an empty enumerable
    }
}
```

The class is automatically inserted in the action execution chain. Also in this case, should the authorization be composed of multiple steps, many authorization classes can be created and they are all wired in the execution chain.

#### Exposing the query through a WebApi controller

When all the query classes are set up, the query must be exposed through a WebApi controller. After creating a plain WebApi controller, you have to inject the query through [constructor injection](https://en.wikipedia.org/wiki/Dependency_injection#Constructor_injection), as follows:

```c#
[Route("api/[controller]")]
[ApiController]
public class MyNewerController : ControllerBase
{
    private readonly IQueryHandler<MyNewQuery, MyNewQueryResult> handler;

    public MyNewerController(IQueryHandler<MyNewQuery, MyNewQueryResult> handler)
    {
        this.handler = handler ?? throw new ArgumentNullException(nameof(handler));
    }

    // GET api/MyNewer
    [HttpGet]
    public ActionResult<MyNewQueryResult> Get([FromQuery] MyNewQuery query)
    {
        return this.handler.Handle(query);
    }
}
```

That's all!

The query is now bound and it can be fired by sending a GET message to the RESTful backend.

Note how the written code has almost nothing to do with infrastructural issues. It belongs to the DomainModel and, thus, has a high value added.

## Credits

Many thanks to [dotnetjunkie](https://github.com/dotnetjunkie) for having inspired this approach in writing action-based backends many years ago and, more recently, for his very interesting [book about Dependency Injection](https://blogs.cuttingedge.it/steven/posts/2019/dependency-injection-principles-practices-and-patterns/) written together with [Mark Seeman](https://blog.ploeh.dk).
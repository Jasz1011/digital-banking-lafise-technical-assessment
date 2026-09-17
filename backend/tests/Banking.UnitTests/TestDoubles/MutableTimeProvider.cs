namespace Banking.UnitTests.TestDoubles;

internal sealed class MutableTimeProvider(DateTimeOffset utcNow) : TimeProvider
{
    public DateTimeOffset UtcNow { get; private set; } = utcNow;

    public override TimeZoneInfo LocalTimeZone => TimeZoneInfo.Utc;

    public override DateTimeOffset GetUtcNow() => UtcNow;

    public void Advance(TimeSpan timeSpan) => UtcNow = UtcNow.Add(timeSpan);
}

